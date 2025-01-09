import { useState } from 'react';

interface IMenu {
  id: string;
  parentId: string;
  name: string;
  path: string;
  children?: Array<IMenu>;
  [key: string]: string | Array<IMenu> | undefined | number;
}

const useMenu = () => {
  const [menu, setMenu] = useState<Array<IMenu>>([]);
  return {
    menu,
    setMenu,
  };
};

export default useMenu;
