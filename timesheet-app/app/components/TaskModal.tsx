"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { X, Info, Plus, Minus } from "lucide-react";
import { FormErrors, Props, TaskFormValues } from "../types";
import { INITIAL_FORM_STATE, PROJECT_OPTIONS, WORK_TYPE_OPTIONS } from "../lib/mockData";

const TaskModal = ({ isOpen, onClose, onSave, initialData, selectedDate }: Props) => {
  const [formData, setFormData] = useState<TaskFormValues>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          project: initialData.projectName || "",
          workType: initialData.title || "",
          description: initialData.title || "",
          hours: initialData.hours || 0,
        });
      } else {
        setFormData(INITIAL_FORM_STATE);
      }
      setErrors({});
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // input change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // hours change handler
  const handleHoursChange = (delta: number) => {
    setFormData((prev) => {
      const updatedHours = Math.max(0, prev.hours + delta);
      if (updatedHours > 0 && errors.hours) {
        setErrors((errPrev) => ({ ...errPrev, hours: undefined }));
      }
      return { ...prev, hours: updatedHours };
    });
  };

  // form validation handler
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.project) newErrors.project = "Please select a project.";
    if (!formData.workType) newErrors.workType = "Please select type of work.";
    if (!formData.description.trim()) newErrors.description = "Task description is required.";
    if (formData.hours <= 0) newErrors.hours = "Hours must be greater than 0.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // form submit handler
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave({
      id: initialData?.id,
      title: formData.description,
      projectName: formData.project,
      hours: formData.hours,
      date: initialData?.date || selectedDate || "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? "Edit Entry" : "Add New Entry"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
              <span>Select Project</span>
              <span className="text-red-500">*</span>
              <Info size={14} className="text-gray-400" />
            </label>
            <select
              name="project"
              value={formData?.project}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 text-sm text-black rounded-lg border appearance-none bg-white focus:outline-none focus:ring-2 transition-all ${errors.project
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
            >
              <option value="">Select Project</option>
              {PROJECT_OPTIONS.map((proOpt) => (
                <option key={proOpt} value={proOpt}> {proOpt} </option>
              ))}
            </select>
            {errors.project && (
              <p className="mt-1 text-xs text-red-500">{errors.project}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
              <span>Type of Work</span>
              <span className="text-red-500">*</span>
              <Info size={14} className="text-gray-400" />
            </label>
            <select
              name="workType"
              value={formData?.workType}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 text-sm text-black rounded-lg border appearance-none bg-white focus:outline-none focus:ring-2 transition-all ${errors.workType
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
            >
              <option value="">Select Type of Work</option>
              {WORK_TYPE_OPTIONS.map((wType) => (
                <option key={wType} value={wType}> {wType} </option>
              ))}
            </select>
            {errors.workType && (
              <p className="mt-1 text-xs text-red-500">{errors.workType}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              <span>Task description</span> <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Write text here ..."
              value={formData?.description}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 text-sm text-black rounded-lg border resize-none focus:outline-none focus:ring-2 transition-all ${errors.description
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
            />
            <p className="text-[11px] text-gray-400 mt-1">A note for extra info</p>
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              <span>Hours</span> <span className="text-red-500">*</span>
            </label>

            <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
              <button
                type="button"
                onClick={() => handleHoursChange(-1)}
                disabled={formData?.hours <= 0}
                className="w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              >
                <Minus size={14} />
              </button>

              <div className="w-12 text-center text-sm font-semibold text-black bg-white py-2.5 border-x border-gray-200">
                {formData?.hours}
              </div>

              <button
                type="button"
                onClick={() => handleHoursChange(1)}
                className="w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            {errors.hours && (
              <p className="mt-1 text-xs text-red-500">{errors.hours}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
            >
              {initialData ? "Update entry" : "Add entry"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;