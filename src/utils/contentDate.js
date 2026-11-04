export const getContentDate = (item) =>
  item?.issue_date || item?.created_at || item?.updated_at || null;

export const toCreatedAtIso = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(`${dateValue}T12:00:00`);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};
