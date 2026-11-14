import { redirect } from "next/navigation";

type ShopPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const categoryAliases: Record<string, string> = {
  cleansers: "cleanser",
  toners: "toners-astringents",
  moisturizers: "moisturizers",
  sunscreen: "sunscreen",
  masks: "masks-peels",
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = firstValue(params.category);
  const type = firstValue(params.type) || (category ? categoryAliases[category] : undefined);
  const concern = firstValue(params.concern);
  const flag = firstValue(params.flag);
  const query = firstValue(params.q);

  const destination =
    category === "makeup"
      ? "/makeup"
      : category === "haircare"
        ? "/haircare"
        : "/skincare";
  const forwardedParams = new URLSearchParams();

  if (type) forwardedParams.set("type", type);
  if (concern) forwardedParams.set("concern", concern);
  if (flag) forwardedParams.set("flag", flag);
  if (query) forwardedParams.set("q", query);

  const queryString = forwardedParams.toString();
  redirect(queryString ? `${destination}?${queryString}` : destination);
}
