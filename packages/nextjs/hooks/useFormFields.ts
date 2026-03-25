"use client";

import { useState } from "react";

export const useFormFields = <T extends Record<string, string>>(initial: T) => {
  const [form, setForm] = useState<T>(initial);

  const updateField = (field: keyof T, value: string) => setForm(current => ({ ...current, [field]: value }));

  const resetForm = () => setForm(initial);

  return { form, updateField, resetForm };
};
