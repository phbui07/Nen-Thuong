interface IAuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout({ children }: IAuthLayoutProps) {
  return (
    <div className="flex items-center justify-center h-[calc(100%-170px)]">
      {children}
    </div>
  );
}
