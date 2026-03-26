import React from "react";
import { motion } from "framer-motion";
import { ArrowLeftOutlined } from "@ant-design/icons";
import AppButton from "@/components/ui/AppButton";

const MotionDiv = motion.div;

export default function EntityFormShell({
  title,
  subtitle,
  onBack,
  children,
  onCancel,
  onSubmit,
  cancelText = "Hủy bỏ",
  submitText = "Lưu",
}) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full min-h-0"
    >
      <div className="mb-6 flex items-center">
        <button
          onClick={onBack}
          className="mr-4 p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-full hover:bg-emerald-50 border border-transparent"
        >
          <ArrowLeftOutlined className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle ? (
            <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl flex-1 overflow-hidden flex flex-col">
        <div className="p-6 md:p-10 overflow-y-auto flex-1 flex flex-col items-center">
          {children}
        </div>

        <div className="px-6 md:px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end space-x-4 shrink-0">
          <AppButton variant="outline" onClick={onCancel}>
            {cancelText}
          </AppButton>

          <AppButton variant="primary" onClick={onSubmit}>
            {submitText}
          </AppButton>
        </div>
      </div>
    </MotionDiv>
  );
}
