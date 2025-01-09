import { Outlet } from '@umijs/max';

const HomePage: React.FC = () => {
  const port = process.env.PORT || 3000;
  console.log(port);
  return <Outlet />;
};

export default HomePage;
