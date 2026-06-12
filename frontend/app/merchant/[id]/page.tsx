"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Star,
  ChevronRight,
  Utensils,
  Clock,
  Tag,
  Camera,
  MessageCircle,
  Heart,
  Bookmark,
  Search,
  Plus,
  Minus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getMerchantById, MerchantResponse } from "@/lib/services/merchant";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600";
const FALLBACK_LOGO = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300";

export default function MerchantPage() {
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);
  const params = useParams();
  const { id } = params as { id: string };

  const [merchant, setMerchant] = useState<MerchantResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      setError("ID quán ăn không hợp lệ.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getMerchantById(numericId)
      .then((data) => setMerchant(data))
      .catch((err) => setError(err.message || "Không thể tải thông tin quán ăn."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-sm">Đang tải thông tin quán ăn...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <p className="text-sm font-semibold text-foreground">Không tải được thông tin</p>
          <p className="text-xs text-muted-foreground">{error}</p>
          <Link href="/">
            <Button variant="outline" size="sm">Về trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Không tìm thấy quán ăn.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans select-none antialiased">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up-slow {
            animation: slideUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.96) translateY(12px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          }
        `
      }} />

      <div className="max-w-7xl mx-auto px-0 md:px-4 py-8">
        {/* Hero Section */}
        <section
          className="relative rounded-[2.5rem] overflow-hidden min-h-[50vh] flex items-end p-6 md:p-12 shadow-xl animate-fade-in"
          style={{
            backgroundImage: `url(${FALLBACK_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="relative z-10 text-white space-y-4">
            <Badge className="bg-orange-500/80 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm backdrop-blur-sm">
              <Utensils className="w-3 h-3 mr-1" /> {merchant.category}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              {merchant.name}
            </h1>
            {merchant.description && (
              <p className="text-base text-white/90 leading-relaxed max-w-xl">
                {merchant.description}
              </p>
            )}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-extrabold shadow-inner">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{merchant.rating_avg?.toFixed(1) ?? "—"}</span>
              </div>
              <Link
                href="#location"
                className="flex items-center gap-1.5 text-white/90 text-sm font-semibold hover:text-orange-300 transition-colors group"
              >
                <MapPin className="w-4 h-4 text-orange-400" />
                <span className="group-hover:underline">{merchant.address.split(",")[0]}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="flex gap-4 pt-4">
              <Button className="px-6 py-3 rounded-full text-sm font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors active:scale-95 group">
                Đặt hàng ngay
                <span className="ml-2 w-7 h-7 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-[1px] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Button>
              <Button
                variant="outline"
                className="px-6 py-3 rounded-full text-sm font-bold border-white/30 text-white hover:bg-white/10 hover:text-white transition-colors active:scale-95 group"
              >
                Đặt bàn
                <span className="ml-2 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-[1px] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                  <ChevronRight className="w-4 h-4 text-white" />
                </span>
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-0">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-16">

            {/* About Section */}
            <section className="py-12 animate-slide-up-slow">
              <Badge className="bg-primary/10 text-primary text-[10px] px-3 py-1 rounded-full uppercase tracking-[0.2em] font-medium mb-4">
                Về chúng tôi
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight mb-6">
                Câu chuyện về {merchant.name}
              </h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <p className="text-base text-foreground leading-relaxed md:max-w-[65ch]">
                  {merchant.description ?? "Chưa có mô tả về quán ăn này."}
                </p>
                <div className="w-full md:w-1/2 flex-shrink-0">
                  <div className="p-1.5 bg-white/5 dark:bg-black/15 border border-white/10 dark:border-white/5 rounded-2xl shadow-lg backdrop-blur-sm">
                    <Image
                      src={FALLBACK_LOGO}
                      alt={`${merchant.name} Logo`}
                      width={300}
                      height={300}
                      className="rounded-[calc(1rem-2px)] object-cover shadow-inner w-full"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Info Cards */}
            <section className="py-4 animate-slide-up-slow">
              <Badge className="bg-primary/10 text-primary text-[10px] px-3 py-1 rounded-full uppercase tracking-[0.2em] font-medium mb-4">
                Thông tin
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight mb-8">Thông tin quán</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-1.5 bg-white/5 dark:bg-black/15 border border-white/10 dark:border-white/5 rounded-2xl shadow-lg backdrop-blur-sm">
                  <div className="p-4 rounded-[calc(1rem-2px)] bg-card/65 dark:bg-card/45 shadow-inner space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Địa chỉ</span>
                    </div>
                    <p className="text-sm text-foreground">{merchant.address}</p>
                  </div>
                </Card>
                <Card className="p-1.5 bg-white/5 dark:bg-black/15 border border-white/10 dark:border-white/5 rounded-2xl shadow-lg backdrop-blur-sm">
                  <div className="p-4 rounded-[calc(1rem-2px)] bg-card/65 dark:bg-card/45 shadow-inner space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Đánh giá</span>
                    </div>
                    <p className="text-2xl font-black tabular-nums text-foreground">
                      {merchant.rating_avg?.toFixed(1) ?? "—"}
                      <span className="text-sm font-normal text-muted-foreground ml-1">/ 5.0</span>
                    </p>
                  </div>
                </Card>
                <Card className="p-1.5 bg-white/5 dark:bg-black/15 border border-white/10 dark:border-white/5 rounded-2xl shadow-lg backdrop-blur-sm">
                  <div className="p-4 rounded-[calc(1rem-2px)] bg-card/65 dark:bg-card/45 shadow-inner space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Utensils className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Danh mục</span>
                    </div>
                    <p className="text-sm text-foreground">{merchant.category}</p>
                  </div>
                </Card>
                <Card className="p-1.5 bg-white/5 dark:bg-black/15 border border-white/10 dark:border-white/5 rounded-2xl shadow-lg backdrop-blur-sm">
                  <div className="p-4 rounded-[calc(1rem-2px)] bg-card/65 dark:bg-card/45 shadow-inner space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Trạng thái</span>
                    </div>
                    <Badge
                      className={`text-xs font-semibold ${
                        merchant.is_active
                          ? "bg-green-500/15 text-green-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {merchant.is_active ? "Đang hoạt động" : "Tạm đóng"}
                    </Badge>
                  </div>
                </Card>
              </div>
            </section>

          </div>

          {/* Right Column - Location */}
          <div className="lg:col-span-1 space-y-16">
            <section id="location" className="py-12 animate-slide-up-slow">
              <Badge className="bg-primary/10 text-primary text-[10px] px-3 py-1 rounded-full uppercase tracking-[0.2em] font-medium mb-4">
                Vị trí
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight mb-8">Địa chỉ</h2>
              <div className="p-1.5 bg-white/5 dark:bg-black/15 border border-white/10 dark:border-white/5 rounded-2xl shadow-lg backdrop-blur-sm">
                <div className="p-4 rounded-[calc(1rem-2px)] bg-card/65 dark:bg-card/45 shadow-inner space-y-6">
                  <div>
                    <h3 className="font-bold text-sm text-muted-foreground/80 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" /> Địa chỉ
                    </h3>
                    <Link
                      href={`/map?lat=${merchant.latitude}&lng=${merchant.longitude}&id=${merchant.id}`}
                      className="text-base text-foreground pl-6 hover:text-orange-500 hover:underline transition-colors block"
                    >
                      {merchant.address}
                    </Link>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-muted-foreground/80 mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-orange-500" /> Đánh giá trung bình
                    </h3>
                    <p className="text-base text-foreground pl-6 font-bold">
                      {merchant.rating_avg?.toFixed(1) ?? "—"} / 5.0
                    </p>
                  </div>
                  <Link
                    href={`/map?lat=${merchant.latitude}&lng=${merchant.longitude}&id=${merchant.id}`}
                    className="w-full h-40 bg-secondary/50 rounded-lg flex flex-col items-center justify-center text-muted-foreground/60 text-sm hover:bg-secondary/70 transition-colors group block"
                  >
                    <MapPin className="w-8 h-8 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-foreground group-hover:text-orange-500">
                      Hiện trên bản đồ
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {merchant.latitude.toFixed(4)}, {merchant.longitude.toFixed(4)}
                    </span>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
