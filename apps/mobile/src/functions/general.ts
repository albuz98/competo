export const formatDateOfBirth = (dob: string): string => {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) return dob;
  const d = new Date(dob);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${d.getFullYear()}`;
  }
  return dob;
};
