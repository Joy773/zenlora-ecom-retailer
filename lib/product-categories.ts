export type Subcategory = {
  value: string;
  label: string;
  param: "type" | "concern";
};

type CategoryGroup = {
  title: string;
  items: Subcategory[];
};

type MainCategory = {
  value: "skincare" | "haircare" | "makeup";
  label: string;
  groups: CategoryGroup[];
};

export const mainCategories: MainCategory[] = [
  {
    value: "skincare",
    label: "Skincare",
    groups: [
      {
        title: "Face",
        items: [
          { value: "cleanser", label: "Cleanser / Facewash", param: "type" },
          {
            value: "day-night-cream",
            label: "Day Cream / Night Cream",
            param: "type",
          },
          { value: "masks-peels", label: "Masks & Peels", param: "type" },
          { value: "sheet-mask", label: "Sheet Mask", param: "type" },
          {
            value: "scrubs-exfoliators",
            label: "Scrubs & Exfoliators",
            param: "type",
          },
          {
            value: "toners-astringents",
            label: "Toners & Astringents",
            param: "type",
          },
          { value: "facial-wipes", label: "Facial Wipes / Kit", param: "type" },
          {
            value: "serum-oils",
            label: "Serum / Oils",
            param: "type",
          },
          {
            value: "moisturizers",
            label: "Moisturizers",
            param: "type",
          },
          { value: "spot-remover", label: "Spot Remover", param: "type" },
          { value: "lip-care", label: "Lip Balms / Lip Care", param: "type" },
        ],
      },
      {
        title: "K-Beauty",
        items: [
          { value: "sunscreen", label: "Sunscreen", param: "type" },
          { value: "essence", label: "Essence", param: "type" },
          { value: "ampoule", label: "Ampoule", param: "type" },
          { value: "cleansing-oil", label: "Cleansing Oil", param: "type" },
          { value: "sleeping-mask", label: "Sleeping Mask", param: "type" },
          {
            value: "eye-patch",
            label: "Eye Cream / Gel / Patch",
            param: "type",
          },
        ],
      },
      {
        title: "Bath & Body",
        items: [
          { value: "hand-cream", label: "Hand Creams", param: "type" },
          { value: "foot-cream", label: "Foot Creams", param: "type" },
          { value: "body-butter", label: "Body Butter", param: "type" },
          { value: "body-mist", label: "Body Mist / Spray", param: "type" },
          { value: "deodorant", label: "Deodorants / Roll-Ons", param: "type" },
          { value: "body-lotion", label: "Lotions & Creams", param: "type" },
          { value: "body-scrub", label: "Body Scrubs", param: "type" },
          {
            value: "anti-stretch-mark",
            label: "Anti-Stretch Mark Creams",
            param: "type",
          },
        ],
      },
      {
        title: "Eye Care & Sun Care",
        items: [
          { value: "eye-cream", label: "Eye Cream / Eye Gel", param: "type" },
          { value: "eye-roller", label: "Eye Roller", param: "type" },
          {
            value: "dark-circles",
            label: "Under Eye / Dark Circles",
            param: "type",
          },
          { value: "sun-care", label: "Sun Care", param: "type" },
          {
            value: "eye-makeup-remover",
            label: "Eye Makeup Remover",
            param: "type",
          },
        ],
      },
      {
        title: "Shop by Concern",
        items: [
          {
            value: "skin-lightening",
            label: "Skin Lightening",
            param: "concern",
          },
          {
            value: "sun-protection",
            label: "Sun Protection",
            param: "concern",
          },
          { value: "tan-removal", label: "Tan Removal", param: "concern" },
          { value: "pigmentation", label: "Pigmentation", param: "concern" },
          { value: "acne", label: "Acne Treatment", param: "concern" },
          { value: "anti-aging", label: "Anti Aging", param: "concern" },
          { value: "oil-control", label: "Oil Control", param: "concern" },
          {
            value: "cold-protection",
            label: "Cold Protection",
            param: "concern",
          },
          {
            value: "dull-skin",
            label: "Dull Skin Treatment",
            param: "concern",
          },
          { value: "pore-care", label: "Pore Care", param: "concern" },
          { value: "dry-skin", label: "Dry Skin Remedy", param: "concern" },
        ],
      },
    ],
  },
  {
    value: "haircare",
    label: "Haircare",
    groups: [
      {
        title: "Hair Care",
        items: [
          { value: "shampoo", label: "Shampoo", param: "type" },
          { value: "conditioner", label: "Conditioner", param: "type" },
          { value: "hair-oil", label: "Hair Oil", param: "type" },
          {
            value: "hair-cream-masks",
            label: "Hair Cream & Masks",
            param: "type",
          },
          { value: "hair-serum", label: "Hair Serum", param: "type" },
          { value: "rebonding-kit", label: "Rebonding Kit", param: "type" },
          { value: "value-pack", label: "Value Pack", param: "type" },
        ],
      },
      {
        title: "Hair Styling",
        items: [
          { value: "hair-color", label: "Hair Color", param: "type" },
          { value: "hair-spray", label: "Hair Spray", param: "type" },
          { value: "gels-waxes", label: "Gels & Waxes", param: "type" },
          { value: "hair-primer", label: "Hair Primer", param: "type" },
        ],
      },
      {
        title: "Tools & Accessories",
        items: [
          { value: "hair-combs", label: "Hair Combs", param: "type" },
          {
            value: "hair-straightener",
            label: "Hair Straightener",
            param: "type",
          },
          { value: "hair-dryer", label: "Hair Dryer", param: "type" },
          { value: "hair-band", label: "Hair Band", param: "type" },
        ],
      },
      {
        title: "Shop by Hair Type & Concern",
        items: [
          { value: "straight", label: "Straight", param: "type" },
          { value: "curly-wavy", label: "Curly & Wavy", param: "type" },
          {
            value: "hairfall-thinning",
            label: "Hairfall & Thinning",
            param: "concern",
          },
          { value: "dandruff", label: "Dandruff", param: "concern" },
          {
            value: "dry-frizzy",
            label: "Dry & Frizzy Hair",
            param: "concern",
          },
          { value: "split-ends", label: "Split Ends", param: "concern" },
          {
            value: "color-protection",
            label: "Color Protection",
            param: "concern",
          },
        ],
      },
    ],
  },
  {
    value: "makeup",
    label: "Makeup",
    groups: [
      {
        title: "Face",
        items: [
          { value: "primers", label: "Primers", param: "type" },
          {
            value: "color-correctors",
            label: "Color Correctors",
            param: "type",
          },
          { value: "foundations", label: "Foundations", param: "type" },
          { value: "bb-cc-creams", label: "BB & CC Creams", param: "type" },
          { value: "concealers", label: "Concealers", param: "type" },
          { value: "setting-powders", label: "Setting Powders", param: "type" },
          { value: "setting-sprays", label: "Setting Sprays", param: "type" },
          { value: "blush", label: "Blush", param: "type" },
          { value: "bronzers", label: "Bronzers", param: "type" },
          { value: "highlighters", label: "Highlighters", param: "type" },
          { value: "contour", label: "Contour", param: "type" },
        ],
      },
      {
        title: "Eyes",
        items: [
          { value: "eyeliner", label: "Eyeliner", param: "type" },
          { value: "mascara", label: "Mascara", param: "type" },
          {
            value: "lash-primers-serums",
            label: "Lash Primers & Serums",
            param: "type",
          },
          { value: "eyeshadow", label: "Eyeshadow", param: "type" },
          {
            value: "glitter-pigments",
            label: "Glitter & Pigments",
            param: "type",
          },
          { value: "eyebrows", label: "Eyebrows", param: "type" },
          { value: "eye-primers", label: "Eye Primers", param: "type" },
          {
            value: "false-lashes-glue",
            label: "False Lashes & Glue",
            param: "type",
          },
        ],
      },
      {
        title: "Lips",
        items: [
          { value: "lipstick", label: "Lipstick", param: "type" },
          { value: "lip-gloss", label: "Lip Gloss", param: "type" },
          { value: "lip-liner", label: "Lip Liner", param: "type" },
          { value: "lip-plumpers", label: "Lip Plumpers", param: "type" },
          {
            value: "lip-balms-tints",
            label: "Lip Balms & Tints",
            param: "type",
          },
          {
            value: "lip-primers-scrubs",
            label: "Lip Primers & Scrubs",
            param: "type",
          },
          {
            value: "lip-masks-oils",
            label: "Lip Masks & Oils",
            param: "type",
          },
        ],
      },
      {
        title: "Beauty Accessories",
        items: [
          { value: "brush-sets", label: "Brush Sets", param: "type" },
          { value: "face-brushes", label: "Face Brushes", param: "type" },
          { value: "eye-brushes", label: "Eye Brushes", param: "type" },
          {
            value: "sponges-blenders",
            label: "Makeup Sponges & Blenders",
            param: "type",
          },
          { value: "powder-puffs", label: "Powder Puffs", param: "type" },
          {
            value: "eyelash-curlers",
            label: "Eyelash Curlers",
            param: "type",
          },
          {
            value: "tweezers-sharpeners",
            label: "Tweezers & Pencil Sharpeners",
            param: "type",
          },
        ],
      },
    ],
  },
];
