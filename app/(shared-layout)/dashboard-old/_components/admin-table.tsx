import { useId, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Doc } from "@/convex/_generated/dataModel";

interface Props {
  data: Doc<"hosts">[];
}

export default function AdminTable({ data }: Props) {
  const id = useId();

  const [selectedIDs, setSelectedIDs] = useState<string[]>([]);

  const handleAllSelect = () => {
    if (selectedIDs.length === data.length) {
      setSelectedIDs([]);
    } else {
      setSelectedIDs(data.map((item) => item._id));
    }
  };

  const handleRowSelect = (itemId: string) => {
    setSelectedIDs((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const selectedItems = data.filter((item) => selectedIDs.includes(item._id));

  /*
  {
    "_creationTime": 1766492463247.9287,
    "_id": "jd711gn6bmbvfmxk24hb1ze7eh7xtmd3",
    "address": "12 Bayit Vagan",
    "authUserId": "k572ktbje51qwr4ax3h1wrwhdx7xvzk5",
    "dob": 846806400000,
    "email": "jo3@ba.fr",
    "ethnicity": "Sefardi",
    "floor": 1,
    "hasDisabilityAccess": true,
    "image": "",
    "isVerified": false,
    "kashrout": "Mehadrin",
    "name": "JoJo3 Elbaz",
    "notes": "",
    "phoneNumber": "+972537081715",
    "role": "admin",
    "sector": "Haredi"
}
   */

  const showSelected = () => {
    console.log(selectedItems);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Button onClick={showSelected}>Show ({selectedIDs.length})</Button>

        {selectedIDs.length > 0 && (
          <Button variant="outline" onClick={() => setSelectedIDs([])}>
            Clear Selection
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11">
                <Checkbox
                  id={id}
                  checked={selectedIDs.length === data.length}
                  onClick={handleAllSelect}
                />
              </TableHead>
              <TableHead className="h-11">Name</TableHead>
              <TableHead className="h-11">Email</TableHead>
              {/*<TableHead className="h-11">Phone Number</TableHead>*/}
              <TableHead className="h-11">Role</TableHead>
              <TableHead className="h-11">Verified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Checkbox
                    id={id}
                    checked={selectedIDs.includes(item._id)}
                    onCheckedChange={() => handleRowSelect(item._id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                {/*<TableCell>*/}
                {/*  <Link*/}
                {/*    className="underline underline-offset-2"*/}
                {/*    href={`tel:${item.phoneNumber}`}*/}
                {/*  >*/}
                {/*    {RPNInput.formatPhoneNumberIntl(item.phoneNumber)}*/}
                {/*  </Link>*/}
                {/*</TableCell>*/}
                <TableCell>
                  <Badge className="bg-red-500">{item.role}</Badge>
                </TableCell>
                <TableCell>{item.isVerified.toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/*<TableFooter className="bg-transparent">*/}
          {/*  <TableRow className="hover:bg-transparent">*/}
          {/*    <TableCell colSpan={5}>Total</TableCell>*/}
          {/*    <TableCell className="text-right">$2,500.00</TableCell>*/}
          {/*  </TableRow>*/}
          {/*</TableFooter>*/}
        </Table>
      </div>
      <p className="mt-4 text-center text-muted-foreground text-sm">
        Total: ${data.length} items | Selected: ${selectedIDs.length}
      </p>
      <p className="mt-4 text-center text-muted-foreground text-sm">
        Card Table
      </p>
    </div>
  );
}
