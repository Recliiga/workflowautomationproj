
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface AdTrackingData {
  weekRange: string;
  video: string;
  adSpend: string;
  reach: string;
  follows: string;
  cpc: string;
}

// Generate sample date ranges for the past 8 weeks
const generateWeekRanges = () => {
  const ranges = [];
  const today = new Date();
  
  for (let i = 7; i >= 0; i--) {
    const endDate = new Date(today);
    endDate.setDate(today.getDate() - (i * 7));
    
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);
    
    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = String(date.getFullYear()).slice(-2);
      return `${day} ${month} ${year}`;
    };
    
    ranges.push(`${formatDate(startDate)} - ${formatDate(endDate)}`);
  }
  
  return ranges;
};

export function AdTracking() {
  const weekRanges = generateWeekRanges();
  
  // Initialize data with empty values for each week
  const [adData, setAdData] = useState<AdTrackingData[]>(
    weekRanges.map(range => ({
      weekRange: range,
      video: "",
      adSpend: "",
      reach: "",
      follows: "",
      cpc: ""
    }))
  );

  const handleCellChange = (rowIndex: number, field: keyof AdTrackingData, value: string) => {
    setAdData(prev => 
      prev.map((row, index) => 
        index === rowIndex ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    console.log("Saving ad tracking data:", adData);
    toast.success("Ad tracking data saved successfully!");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ad Tracking</CardTitle>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Week</TableHead>
                <TableHead>Video</TableHead>
                <TableHead>Ad Spend ($)</TableHead>
                <TableHead>Reach</TableHead>
                <TableHead>Follows</TableHead>
                <TableHead>CPC ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.weekRange}</TableCell>
                  <TableCell>
                    <Input
                      value={row.video}
                      onChange={(e) => handleCellChange(index, 'video', e.target.value)}
                      placeholder="Video name"
                      className="min-w-[150px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={row.adSpend}
                      onChange={(e) => handleCellChange(index, 'adSpend', e.target.value)}
                      placeholder="0.00"
                      className="min-w-[100px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={row.reach}
                      onChange={(e) => handleCellChange(index, 'reach', e.target.value)}
                      placeholder="0"
                      className="min-w-[100px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={row.follows}
                      onChange={(e) => handleCellChange(index, 'follows', e.target.value)}
                      placeholder="0"
                      className="min-w-[100px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={row.cpc}
                      onChange={(e) => handleCellChange(index, 'cpc', e.target.value)}
                      placeholder="0.00"
                      className="min-w-[100px]"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
