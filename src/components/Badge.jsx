import React from "react";

export default function Badge({ children, type }) {
  const cls = type === "office" ? "badge-office tag" : type === "unit" ? "badge-unit tag" : "badge-gst tag";
  return <span className={cls}>{children}</span>;
}
