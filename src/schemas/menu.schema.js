export const menuGroupOptions = [
  { value: "", label: "No menu (no nav label)" },
  { value: "top", label: "Top navigation (top level)" },
  { value: "about", label: "About Us (dropdown)" },
  { value: "news", label: "News & Updates (dropdown)" },
  { value: "membership", label: "Membership (dropdown)" },
];

export const menuSchema = {
  staticLinks: [
    { title: "Home", path: "/", hasDropdown: false },
    {
      title: "About Us",
      path: "/about",
      hasDropdown: true,
      dropdownItems: [
        { title: "Governance", path: "/governance" },
        {
          title: "Health Guardian",
          path: "https://hfn-health-guardians.netlify.app/",
          external: true,
        },
      ],
    },
    {
      title: "News & Updates",
      path: "#",
      hasDropdown: true,
      dropdownItems: [
        { title: "Latest News", path: "/news" },
        { title: "Newsletters", path: "/resources" },
        { title: "Events", path: "/events" },
        { title: "Gallery", path: "/gallery" },
      ],
    },
    {
      title: "Membership",
      path: "#",
      hasDropdown: true,
      dropdownItems: [
        { title: "Member Area", path: "/membership" },
        { title: "Get Involved", path: "/get-involved" },
        {
          title: "Directory",
          path: "https://directory.hfnigeria.com/register",
          external: true,
        },
      ],
    },
    { title: "Contact Us", path: "/contact", hasDropdown: false },
  ],
};
