import type { Metadata } from "next"
import "../../globals.css"
import Header from "./(components)/Header"
import Footer from "./(components)/Footer"

export const metadata: Metadata = {
  title: "Caner Demirci - Kişisel Blog",
  description: "Caner Demirci - Kişisel Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark:bg-[#0d1116] bg-white">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
