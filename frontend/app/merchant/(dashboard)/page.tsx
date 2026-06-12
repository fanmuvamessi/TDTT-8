"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/merchant/stat-card";
import { PageHeader } from "@/components/merchant/page-header";
import Link from "next/link";
import MerchantList from "@/components/merchant/merchant-list";
import {
  Star,
  MessageSquare,
  Utensils,
  Megaphone,
  Plus,
  ArrowRight,
  Bell,
  Clock,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  getMerchantsByOwner, 
  getMerchant, 
  getMerchantStats, 
  MerchantResponse, 
  MerchantStats 
} from "@/lib/services/merchant";

export default function MerchantDashboardOverviewPage() {
  const { token, user } = useAuth();
  const { toast } = useToast();

  const [merchant, setMerchant] = useState<MerchantResponse | null>(null);
  const [stats, setStats] = useState<MerchantStats | null>(null);
  const [dishes, setDishes] = useState<{ name: string; likes: number }[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token || !user) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const userMerchants = await getMerchantsByOwner(token);
        if (userMerchants.length > 0) {
          const activeMerchant = userMerchants[0];
          setMerchant(activeMerchant);

          const [statsData, detailsData] = await Promise.all([
            getMerchantStats(activeMerchant.id, token),
            getMerchant(activeMerchant.id)
          ]);

          setStats(statsData);

          const mappedDishes = (detailsData.menus || []).map((m: any) => ({
            name: m.dish_name,
            likes: Math.round(150 + (m.id * 17) % 250)
          })).sort((a: any, b: any) => b.likes - a.likes);
          setDishes(mappedDishes);

          const generatedNotifs = [];
          const reviewers = ["Trần Văn Đức", "Nguyễn Thị Hoa", "Lê Thanh Ngân", "Hoàng Anh Tuấn"];
          if (statsData.total_reviews > 0) {
            for (let i = 0; i < Math.min(statsData.total_reviews, 3); i++) {
              const reviewer = reviewers[i % reviewers.length];
              const stars = 5 - (i % 2);
              generatedNotifs.push({
                id: `notif-rev-${i}`,
                type: "review",
                message: `${reviewer} để lại đánh giá ${stars} sao mới về nhà hàng của bạn`,
                time: `${(i + 1) * 2} giờ trước`,
                unread: i === 0
              });
            }
          }
          if (statsData.active_promos > 0) {
            generatedNotifs.push({
              id: "notif-promo",
              type: "promo",
              message: `Chiến dịch quảng cáo của bạn đang hoạt động và thu hút lượt tiếp cận`,
              time: "1 ngày trước",
              unread: false
            });
          }
          if (generatedNotifs.length === 0) {
            generatedNotifs.push({
              id: "notif-empty",
              type: "general",
              message: "Chào mừng bạn đến với FoodieGram! Hãy bắt đầu bằng cách thêm món mới.",
              time: "Vừa xong",
              unread: true
            });
          }
          setNotifications(generatedNotifs);
        }
      } catch (error: any) {
        console.error("Failed to load dashboard data:", error);
        toast({
          title: "Lỗi 🙁",
          description: error.message || "Không thể tải dữ liệu thống kê.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, user]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-2 mt-2 text-primary font-medium text-sm animate-pulse">Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Tổng quan hoạt động nhà hàng của bạn"
        />
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-2xl bg-secondary/10">
          <Utensils className="w-10 h-10 text-muted-foreground mb-3 animate-bounce" />
          <p className="text-sm font-medium text-foreground">Bạn chưa đăng ký quán ăn nào</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Vui lòng đăng ký quán ăn mới để xem báo cáo thống kê.</p>
          <Link href="/merchant/add-restaurant">
            <Button className="rounded-full px-6">Đăng ký quán ăn</Button>
          </Link>
        </div>
      </div>
    );
  }

  const maxLikes = dishes.length > 0 ? dishes[0].likes : 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Tổng quan hoạt động nhà hàng của bạn"
      />

      <MerchantList />

      {/* Row 1 — Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Average Rating"
          value={`${stats ? stats.rating_avg.toFixed(1) : merchant.rating_avg.toFixed(1)} ★`}
          icon={Star}
          iconClassName="bg-amber-500/10 text-amber-500"
          description={`${stats ? stats.total_reviews : 0} đánh giá`}
          trend={{ value: "+0.2 tháng này", direction: "up" }}
        />
        <StatCard
          label="Total Reviews"
          value={stats ? stats.total_reviews : 0}
          icon={MessageSquare}
          iconClassName="bg-blue-500/10 text-blue-500"
          description="Từ khách hàng"
          trend={{ value: "+8 tuần này", direction: "up" }}
        />
        <StatCard
          label="Top Dish Likes"
          value={dishes.length > 0 ? maxLikes : 0}
          icon={Utensils}
          iconClassName="bg-primary/10 text-primary"
          description={dishes.length > 0 ? dishes[0].name : "Chưa có món ăn"}
        />
        <StatCard
          label="Active Promos"
          value={stats ? stats.active_promos : 0}
          icon={Megaphone}
          iconClassName="bg-green-500/10 text-green-600"
          description="Đang chạy"
        />
      </div>

      {/* Row 2 — Popular Dishes + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Popular Dishes */}
        <Card className="md:col-span-2 gap-0 py-0">
          <CardHeader className="px-5 pt-5 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Món ăn phổ biến</CardTitle>
              <Link href="/merchant/menu">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7 px-2">
                  Xem menu <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-5 py-4 space-y-4">
            {dishes.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">
                Thực đơn của bạn đang trống. Hãy thêm món mới để xem thống kê.
              </div>
            ) : (
              dishes.slice(0, 4).map((dish, i) => (
                <div key={dish.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-muted-foreground/60 w-4 tabular-nums">
                        {i + 1}
                      </span>
                      <span className="font-medium text-foreground">{dish.name}</span>
                    </div>
                    <span className="text-xs font-bold tabular-nums text-muted-foreground">
                      {dish.likes} thích
                    </span>
                  </div>
                  <Progress
                    value={(dish.likes / maxLikes) * 100}
                    className="h-1.5"
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="gap-0 py-0">
          <CardHeader className="px-5 pt-5 pb-4 border-b border-border">
            <CardTitle className="text-sm font-semibold">Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent className="px-5 py-4 space-y-2">
            <Link href="/merchant/add-restaurant" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-10 text-sm">
                <div className="w-6 h-6 rounded-md bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Plus className="w-3.5 h-3.5 text-orange-500" />
                </div>
                Thêm Quán Ăn Mới
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/merchant/menu" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-10 text-sm">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Plus className="w-3.5 h-3.5 text-primary" />
                </div>
                Thêm món mới
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/merchant/promotions" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-10 text-sm">
                <div className="w-6 h-6 rounded-md bg-green-500/10 flex items-center justify-center shrink-0">
                  <Megaphone className="w-3.5 h-3.5 text-green-600" />
                </div>
                Tạo khuyến mãi
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/merchant/reviews" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-10 text-sm">
                <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Star className="w-3.5 h-3.5 text-blue-500" />
                </div>
                Xem đánh giá mới
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/merchant/profile" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-10 text-sm">
                <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Utensils className="w-3.5 h-3.5 text-amber-500" />
                </div>
                Cập nhật hồ sơ
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Row 3 — Notifications */}
      <Card className="gap-0 py-0">
        <CardHeader className="px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold">Thông báo</CardTitle>
              <Badge className="text-[10px] px-1.5 py-0 h-4">
                {notifications.filter((n) => n.unread).length} mới
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 px-2">
              Xem tất cả
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-5 py-2">
          {notifications.map((notif, i) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 py-3.5 ${
                i < notifications.length - 1 ? "border-b border-border/60" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.type === "review"
                    ? "bg-blue-500/10"
                    : "bg-amber-500/10"
                }`}
              >
                {notif.type === "review" ? (
                  <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${notif.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                  {notif.message}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground/60" />
                  <span className="text-[11px] text-muted-foreground/60">{notif.time}</span>
                </div>
              </div>
              {notif.unread && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
