

"use client"
import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cryptocurrencies } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Bell, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useCollection, useUser, useFirestore, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking, WithId } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { Skeleton } from "../ui/skeleton"

const alertSchema = z.object({
  cryptocurrencyDataId: z.string().min(1, "Please select a cryptocurrency."),
  triggerCondition: z.enum([">", "<"]),
  triggerValue: z.coerce.number().positive("Price must be a positive number."),
})

interface Alert {
  cryptocurrencyDataId: string;
  triggerCondition: string;
  triggerValue: number;
  active: boolean;
  userId: string;
  alertType: string;
  createdTimestamp: string;
}

export function AlertsCard() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const alertsCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'alerts');
  }, [firestore, user]);

  const { data: alerts, isLoading } = useCollection<Alert>(alertsCollectionRef);

  const form = useForm<z.infer<typeof alertSchema>>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      cryptocurrencyDataId: "bitcoin",
      triggerCondition: ">",
      triggerValue: 0,
    },
  })

  function onSubmit(values: z.infer<typeof alertSchema>) {
    if (!user || !alertsCollectionRef) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to create alerts." });
      return;
    }
    const crypto = cryptocurrencies.find(c => c.id === values.cryptocurrencyDataId);
    
    addDocumentNonBlocking(alertsCollectionRef, {
        ...values,
        userId: user.uid,
        alertType: 'push', // default
        createdTimestamp: new Date().toISOString(),
        active: true,
    });
    
    toast({
      title: "Alert Created",
      description: `You will be notified when ${crypto?.ticker} is ${values.triggerCondition} $${values.triggerValue}.`,
    })

    setIsDialogOpen(false);
    form.reset();
  }

  const toggleAlertStatus = (alert: WithId<Alert>) => {
    if (!user || !firestore) return;
    const alertRef = doc(firestore, 'users', user.uid, 'alerts', alert.id);
    updateDocumentNonBlocking(alertRef, { active: !alert.active });
  };

  const deleteAlert = (alertId: string) => {
    if (!user || !firestore) return;
    const alertRef = doc(firestore, 'users', user.uid, 'alerts', alertId);
    deleteDocumentNonBlocking(alertRef);
    toast({
        title: "Alert Deleted",
        description: "The alert has been successfully removed.",
    });
  }

  const getCryptoTicker = (cryptoId: string) => {
    return cryptocurrencies.find(c => c.id === cryptoId)?.ticker || 'N/A';
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Custom Alerts</CardTitle>
          <CardDescription>Manage your price notifications.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
              <DialogDescription>
                Get notified when a cryptocurrency reaches a specific price.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cryptocurrencyDataId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cryptocurrency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a crypto" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cryptocurrencies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                    <FormField
                    control={form.control}
                    name="triggerCondition"
                    render={({ field }) => (
                        <FormItem className="w-1/3">
                        <FormLabel>Condition</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value=">">Greater than</SelectItem>
                                <SelectItem value="<">Less than</SelectItem>
                            </SelectContent>
                        </Select>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="triggerValue"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>Price (USD)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g. 70000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <DialogFooter>
                  <Button type="submit">Create Alert</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && (
            <>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </>
          )}
          {!isLoading && alerts && alerts.map(alert => (
            <div key={alert.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{getCryptoTicker(alert.cryptocurrencyDataId)}</p>
                  <p className="text-sm text-muted-foreground">Price {alert.triggerCondition} ${alert.triggerValue}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                  <Switch checked={alert.active} onCheckedChange={() => toggleAlertStatus(alert)} />
                  <Button variant="ghost" size="icon" onClick={() => deleteAlert(alert.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
              </div>
            </div>
          ))}
           {!isLoading && (!alerts || alerts.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">You have no active alerts.</p>
           )}
        </div>
      </CardContent>
    </Card>
  )
}
