"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import { Spinner } from "./Spinner";

const ImageWithSpinner = ({
  height,
  width,
  src,
  alt,
  className,
}: {
  height: number;
  width: number;
  src: string;
  alt: string;
  className?: string;
}) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <>
      {isLoading && (
        <Spinner
          className={cn("absolute transition-opacity duration-300")}
        ></Spinner>
      )}{" "}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setLoading(false)}
        unoptimized
      ></Image>
    </>
  );
};

export default ImageWithSpinner;
