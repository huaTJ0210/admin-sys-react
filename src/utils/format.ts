// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}

export function formatSelectOptions<T>(
  data: Array<T>,
  success: boolean,
  labelName: keyof T,
  valueName: keyof T,
) {
  let list: Array<{ label: string; value: string }> = [];
  if (success) {
    list = (data || []).map((app) => ({
      label: app[labelName] as string,
      value: app[valueName] as string,
    }));
  }
  return list;
}

function flatRecursion<T>(
  list: Array<T>,
  childKey: keyof T,
  container: Array<T>,
) {
  list.forEach((item) => {
    container.push(item);
    const children = item[childKey] || [];
    flatRecursion(children as T[], childKey, container);
  });
}

export function flatArray<T>(list: Array<T>, childKey: keyof T) {
  const array: Array<T> = [];
  flatRecursion<T>(list, childKey, array);
  return array;
}
