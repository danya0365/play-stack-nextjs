import { LayoutWrapper } from "@/src/presentation/layouts/LayoutWrapper";
import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import "../public/styles/index.css";

export const metadata = {
  title: "Play Stack - Game Development Courses",
  description: "เรียนรู้การพัฒนาเกมตั้งแต่พื้นฐานจนถึงระดับมืออาชีพ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
