import "@/styles/globals.css";
import Provider from "@/components/SessionProvider";
import Sidebar from "@/components/SideBar";
export const metadata = {
  title: "BA Klik Indomaret Sukses",
  description: "Dashboard for managing KIS projects",
};
export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Sidebar />
          <div>{children}</div>
        </Provider>
      </body>
    </html>
  );
}