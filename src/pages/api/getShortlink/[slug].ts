import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@db";
import { RedirectType } from "@prismaGenerated";

export type ShortlinkResponse = {
  url: string;
  redirect: RedirectType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShortlinkResponse | { error: string }>
) {
  const slug = req.query.slug;

  if (!slug || typeof slug !== "string") {
    res.status(400).json({ error: "Invalid slug" });
    return;
  }

  const link = await prisma.link.findUnique({
    where: { slug },
  });

  if (!link) {
    res.status(404).json({ error: "Link not found" });
    return;
  }

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (link.enableCache === false) {
    res.setHeader("Cache-Control", "no-cache");
  }

  let cacheHeader = `public, s-maxage=${link.maxAge}`;

  if (link.enableSwr) {
    cacheHeader += `, stale-while-revalidate${
      link.swrAge ? `=${link.swrAge}` : ""
    }`;
  }

  res.setHeader("Cache-Control", cacheHeader);
  res.status(200).json({ url: link.url, redirect: link.redirectType });
  return;
}
