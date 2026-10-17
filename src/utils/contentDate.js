export const getContentDate = (item) =>
  item?.issue_date || item?.created_at || item?.updated_at || null;
