"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);


  const isLastSegment = (index: number) => {
    return index === segments.length - 1;
  };

  const segnmentUrl = (segment: string) => {
    return pathname.substring(0, pathname.indexOf(segment) + segment.length);
  };

  return (
    <Breadcrumb className="flex-grow">
      <BreadcrumbList>
        {segments
          .map((segment, idx) => {
            return isLastSegment(idx) ? (
              <BreadcrumbItem key={idx} className="capitalize">
                <BreadcrumbPage>{decodeURIComponent(segment)}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <React.Fragment key={idx}>
                <BreadcrumbItem
                  className="hidden capitalize md:block"
                  key={idx}
                >
                  <BreadcrumbLink asChild>
                    <Link href={segnmentUrl(segment)}>{segment}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator
                  className="hidden md:block"
                  key={`${idx}-separator`}
                />
              </React.Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
