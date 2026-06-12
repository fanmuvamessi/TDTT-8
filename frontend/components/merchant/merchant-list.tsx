"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getMerchantsByOwner, MerchantResponse } from "@/lib/services/merchant";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Store,
  MapPin,
  Star,
  Plus,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function MerchantList() {
  const { token } = useAuth();
  const [merchants, setMerchants] = useState<MerchantResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Chưa đăng nhập.");
      setLoading(false);
      return;
    }
    getMerchantsByOwner(token)
      .then((data) => setMerchants(data))
      .catch((err) => setError(err.message || "Không thể tải danh sách quán ăn."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24 gap-2 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Đang tải quán ăn...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (merchants.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-10 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Chưa có quán ăn nào</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Thêm quán ăn đầu tiên để bắt đầu quản lý.
            </p>
          </div>
          <Link href="/merchant/add-restaurant">
            <Button size="sm" className="gap-1.5 mt-1">
              <Plus className="w-3.5 h-3.5" />
              Thêm quán ăn mới
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold px-1">
          Quán ăn của bạn ({merchants.length})
        </p>
        <Link href="/merchant/add-restaurant">
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground">
            <Plus className="w-3 h-3" />
            Thêm mới
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {merchants.map((merchant) => (
          <Link key={merchant.id} href={`/merchant/${merchant.id}`}>
            <Card className="cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all duration-150 group gap-0 py-0">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Store className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {merchant.name}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] shrink-0 px-1.5 py-0 h-4 ${
                          merchant.is_active
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {merchant.is_active ? "Hoạt động" : "Tắt"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                      <p className="text-xs text-muted-foreground truncate">{merchant.address}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-semibold text-foreground tabular-nums">
                          {merchant.rating_avg?.toFixed(1) ?? "—"}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                        {merchant.category}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
