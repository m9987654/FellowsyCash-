import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "الرئيسية", href: "/" },
    { name: "الخدمات", href: "#services" },
    { name: "الشراكات", href: "#partners" },
    { name: "من نحن", href: "#about" },
  ];

  const userNavigation = [
    { name: "الرئيسية", href: "/" },
    { name: "طلب تمويل", href: "/funding-request" },
    { name: "خطط الادخار", href: "/savings-goals" },
    { name: "الاستثمارات", href: "/investment-offers" },
  ];

  const currentNav = isAuthenticated ? userNavigation : navigation;

  return (
    <nav className="navbar-glass sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center text-white font-bold">
              F
            </div>
            <span className="text-2xl font-bold text-gray-800">Flous Cash</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {currentNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-gray-700 hover:text-primary transition-colors ${
                  location === item.href ? "text-primary font-medium" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user?.firstName || "صديقي"}
                  </span>
                </div>
                <div className="relative">
                  <Button variant="ghost" size="sm" className="glass-card p-2">
                    <Bell className="w-4 h-4" />
                  </Button>
                  <div className="notification-badge absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    3
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/api/logout">تسجيل الخروج</a>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/api/login">تسجيل الدخول</a>
                </Button>
                <Button size="sm" className="floating-button" asChild>
                  <a href="/api/login">سجّل دلوقتي</a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-4">
              {currentNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-gray-700 hover:text-primary transition-colors px-2 py-1 ${
                    location === item.href ? "text-primary font-medium" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t pt-4">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {user?.firstName || "صديقي"}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/api/logout">تسجيل الخروج</a>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a href="/api/login">تسجيل الدخول</a>
                    </Button>
                    <Button size="sm" className="floating-button" asChild>
                      <a href="/api/login">سجّل دلوقتي</a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
