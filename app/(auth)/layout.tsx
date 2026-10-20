interface IAuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout({ children }: IAuthLayoutProps) {
  return <div className="flex justify-center px-4 py-12 md:py-16">{children}</div>;
}
