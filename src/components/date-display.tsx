import { useEffect, useState } from "react";

function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("en-GB"); // DD/MM/YYYY format
  const time = now.toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${date} ${time}`;
}

export function DateDisplay() {
  const [currentDateTime, setCurrentDateTime] = useState(() =>
    getCurrentDateTime(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="terminal-text text-sm font-extrabold bloomberg-amber"
      suppressHydrationWarning
    >
      {currentDateTime}
    </div>
  );
}
