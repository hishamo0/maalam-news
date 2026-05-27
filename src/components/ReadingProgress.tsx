"use client";

/* =========================================================
   Imports
========================================================= */

import { useEffect, useState } from "react";

/* =========================================================
   شريط تقدم القراءة
========================================================= */

export default function ReadingProgress() {

  /* =======================================================
     نسبة التقدم
  ======================================================= */

  const [progress, setProgress] = useState(0);

  /* =======================================================
     مراقبة النزول داخل الصفحة
  ======================================================= */

  useEffect(() => {

    const updateProgress = () => {

      const scrollTop = window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const percentage =
        (scrollTop / documentHeight) * 100;

      setProgress(percentage);

    };

    window.addEventListener(
      "scroll",
      updateProgress
    );

    return () => {

      window.removeEventListener(
        "scroll",
        updateProgress
      );

    };

  }, []);

  return (

    <div
      className="
        fixed
        top-0
        left-0
        h-[3px]
        z-[9999]
        bg-red-500
        transition-all
        duration-150
      "
      style={{
        width: `${progress}%`,
      }}
    />

  );

}