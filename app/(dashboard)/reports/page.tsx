import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">التقارير</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 /> تقرير المبيعات الشهري</CardTitle>
            <CardDescription>قريباً: تحليل مفصل للمبيعات والأرباح.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">سيتم عرض مخططات تفاعلية هنا.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText /> تصدير البيانات</CardTitle>
            <CardDescription>قريباً: تصدير الطلبات والعملاء إلى ملفات CSV.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">سيتم توفير خيارات التصدير هنا.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
