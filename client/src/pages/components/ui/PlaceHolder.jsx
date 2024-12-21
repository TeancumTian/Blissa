import React from "react";

export function Button({ children }) {
  return <button className="p-2 bg-gray-200 rounded">{children}</button>;
}

export function Card({ children }) {
  return <div className="p-4 bg-white shadow-md rounded">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}

export function Progress({ value }) {
  return (
    <div className="w-full bg-gray-300 rounded-full h-4">
      <div
        className="bg-green-500 h-4 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}
