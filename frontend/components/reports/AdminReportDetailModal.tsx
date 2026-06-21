"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Report, patchReportStatus } from "@/lib/services/admin";
import { useAuth } from "@/hooks/use-auth";

interface AdminReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
  onUpdate: () => void; // Callback to refresh the list
}

const AdminReportDetailModal: React.FC<AdminReportDetailModalProps> = ({
  isOpen,
  onClose,
  report,
  onUpdate,
}) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [currentStatus, setCurrentStatus] = useState<Report["status"] | "">("");
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (report) {
      setCurrentStatus(report.status);
      setAdminNotes(""); // Clear notes when a new report is opened
    }
  }, [report]);

  const handleStatusChange = (value: Report["status"]) => {
    setCurrentStatus(value);
  };

  const handleSaveChanges = async () => {
    if (!report || !token || !currentStatus || currentStatus === "pending") {
      toast({
        title: "Lỗi",
        description: "Trạng thái báo cáo không hợp lệ hoặc thiếu thông tin.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await patchReportStatus(token, report.id, currentStatus as "under_review" | "resolved" | "rejected");
      toast({
        title: "Thành công",
        description: "Đã cập nhật trạng thái báo cáo.",
      });
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error("Failed to update report status:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Cập nhật trạng thái báo cáo thất bại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!report) return null; // Or render a loading state

  const getStatusText = (status: Report["status"]) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chi tiết báo cáo #{report.id}</DialogTitle>
          <DialogDescription>
            Xem xét chi tiết báo cáo và cập nhật trạng thái.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reporter" className="text-right">Người báo cáo</Label>
            <Input
              id="reporter"
              value={report.reporter?.full_name ?? `Người dùng #${report.reporter_id}`}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entityType" className="text-right">Loại đối tượng</Label>
            <Input
              id="entityType"
              value={report.reported_entity_type}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entityId" className="text-right">ID đối tượng</Label>
            <Input
              id="entityId"
              value={report.reported_entity_id}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">Lý do</Label>
            <Textarea
              id="reason"
              value={report.reason}
              className="col-span-3 resize-none"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="createdAt" className="text-right">Ngày tạo</Label>
            <Input
              id="createdAt"
              value={new Date(report.created_at).toLocaleString("vi-VN")}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="updatedAt" className="text-right">Cập nhật lúc</Label>
            <Input
              id="updatedAt"
              value={new Date(report.updated_at).toLocaleString("vi-VN")}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Trạng thái</Label>
            <Select onValueChange={handleStatusChange} value={currentStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Cập nhật trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending" disabled>Chờ xử lý</SelectItem>
                <SelectItem value="under_review">Đang xem xét</SelectItem>
                <SelectItem value="resolved">Đã giải quyết</SelectItem>
                <SelectItem value="rejected">Đã từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="adminNotes" className="text-right">Ghi chú Admin</Label>
            <Textarea
              id="adminNotes"
              placeholder="Thêm ghi chú nội bộ về báo cáo này..."
              className="col-span-3 resize-y"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminReportDetailModal;
