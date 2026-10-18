"use client";

import React from "react";

type Props = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
};

/** Text input for rates so users can type values like 25 without fighting number spinners. */
export default function RateDecimalInput({
  name,
  value,
  onChange,
  className = "w-full px-2 py-1 border border-gray-300 rounded-md text-sm",
  placeholder = "",
  required,
}: Props) {
  return (
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={className}
    />
  );
}
