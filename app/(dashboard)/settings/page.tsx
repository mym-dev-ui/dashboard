import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">الإعدادات</h1>
      <Card>
        <CardHeader>
          <CardTitle>معلومات المتجر</CardTitle>
          <CardDescription>تحديث معلومات متجرك العامة.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store-name">اسم المتجر</Label>
            <Input id="store-name" defaultValue="أكوا فلو" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store-email">البريد الإلكتروني للتواصل</Label>
            <Input id="store-email" type="email" defaultValue="contact@aquaflow.sa" />
          </div>
          <Separator />
          <Button>حفظ التغييرات</Button>
        </CardContent>
      </Card>
    </div>
  );
}
