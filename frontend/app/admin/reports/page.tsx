"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/merchant/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { getAdminReports, Report, patchReportStatus } from "@/lib/services/admin";
import { Badge } from "@/components/ui/badge";
import AdminReportDetailModal from "@/components/reports/AdminReportDetailModal";

const LIMIT = 20;

export default function AdminReportsPage() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [entityTypeFilter, setEntityTypeFilter] = useState<"all" | "user" | "merchant" | "post" | "reel">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "under_review" | "resolved" | "rejected">("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const fetchReports = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminReports(token, {
        limit: LIMIT,
        offset: page * LIMIT,
        reported_entity_type: entityTypeFilter === "all" ? undefined : entityTypeFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setReports(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, entityTypeFilter, statusFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const totalPages = Math.ceil(total / LIMIT);

  const getStatusBadgeClass = (status: Report['status']) => {
    switch (status) {
      case "pending":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "under_review":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "resolved":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "under_review":
        return "Đang xem xét";
      case "resolved":
        return "Đã giải quyết";
      case "rejected":
        return "Đã từ chối";
      default:
        return "Không rõ";
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Quản lý Báo cáo" description={`${total} báo cáo trên hệ thống`} />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm báo cáo..." className="pl-9" />
            </div>
            <Select value={entityTypeFilter} onValueChange={(v) => { setEntityTypeFilter(v as "all" | "user" | "merchant" | "post" | "reel"); setPage(0); }}>
              <SelectTrigger className="w-40 h-9 text-sm">
                <SelectValue placeholder="Loại đối tượng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="user">Người dùng</SelectItem>
                <SelectItem value="merchant">Quán ăn</SelectItem>
                <SelectItem value="post">Bài viết</SelectItem>
                <SelectItem value="reel">Reel</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as "all" | "pending" | "under_review" | "resolved" | "rejected"); setPage(0); }}>
              <SelectTrigger className="w-40 h-9 text-sm">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="under_review">Đang xem xét</SelectItem>
                <SelectItem value="resolved">Đã giải quyết</SelectItem>
                <SelectItem value="rejected">Đã từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">ID</TableHead>
              <TableHead>Người báo cáo</TableHead>
              <TableHead>Loại đối tượng</TableHead>
              <TableHead>ID đối tượng</TableHead>
              <TableHead>Lý do</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-5 rounded bg-muted animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-sm">
                  Không tìm thấy báo cáo nào.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="text-xs text-muted-foreground font-mono">{report.id}</TableCell>
                  <TableCell className="font-medium text-sm">{report.reporter?.full_name ?? `Người dùng #${report.reporter_id}`}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{report.reported_entity_type}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{report.reported_entity_id}</TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">{report.reason}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[11px] ${getStatusBadgeClass(report.status)}`}>
                      {getStatusText(report.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {report.created_at ? new Date(report.created_at).toLocaleDateString("vi-VN") : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(report)}>Chi tiết</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Trang {page + 1} / {totalPages} — {total} báo cáo
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                disabled={page === 0}
                onClick={() => handlePageChange(page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                disabled={page >= totalPages - 1}
                onClick={() => handlePageChange(page + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AdminReportDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        report={selectedReport}
        onUpdate={fetchReports}
      />
    </div>
  );
}
