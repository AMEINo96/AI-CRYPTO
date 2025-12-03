
"use client"
import * as React from "react"
import { newsArticles } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Wand2, Loader2, ExternalLink } from "lucide-react"
import { summarizeCryptoNews } from "@/ai/flows/summarize-crypto-news"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export function NewsFeedCard() {
  const [isSummarizing, setIsSummarizing] = React.useState(false)
  const [summary, setSummary] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const { toast } = useToast()

  const handleSummarize = async () => {
    setIsSummarizing(true)
    try {
      const articlesContent = newsArticles.map(a => a.title).join("\n\n")
      const result = await summarizeCryptoNews({ newsArticles: articlesContent })
      setSummary(result.summary)
      setIsDialogOpen(true)
    } catch (error) {
      console.error("Summarization failed:", error)
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: "Could not summarize news. Please try again.",
      })
    } finally {
      setIsSummarizing(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>News Feed</CardTitle>
            <CardDescription>Latest market-moving headlines.</CardDescription>
          </div>
          <Button onClick={handleSummarize} disabled={isSummarizing} size="sm">
            {isSummarizing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Summarize
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-4">
              {newsArticles.map((article, index) => (
                <React.Fragment key={article.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-medium leading-none">{article.title}</p>
                      <p className="text-sm text-muted-foreground">{article.source} · {article.time}</p>
                    </div>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </a>
                  </div>
                  {index < newsArticles.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Wand2 /> AI News Summary</DialogTitle>
            <DialogDescription>
              A concise overview of the latest crypto news.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        </DialogContent>
      </Dialog>
    </>
  )
}
