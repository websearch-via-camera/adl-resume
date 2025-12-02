import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, PenLine, Sparkles, Heart } from "lucide-react"
import { toast } from "sonner"

// Manually curated guestbook entries - add new ones here after receiving via email
const guestbookEntries: Array<{
  name: string
  message: string
  date: string
  emoji?: string
}> = [
  // Example entry format:
  // {
  //   name: "Jane Doe",
  //   message: "Amazing portfolio! The terminal section is so creative.",
  //   date: "2025-11-29",
  //   emoji: "🚀"
  // },
]

export function Guestbook() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    emoji: "👋"
  })

  const emojis = ["👋", "🚀", "💡", "🎉", "⭐", "🔥", "💜", "🙌"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.message.trim()) {
      toast.error("Please fill in your name and message")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          message: formData.message,
          emoji: formData.emoji,
          date: new Date().toISOString().split('T')[0]
        }),
      })

      if (!response.ok) throw new Error('Failed to submit')

      toast.success("Thanks for signing! Your message will appear soon after review. 💜")
      setFormData({ name: "", message: "", emoji: "👋" })
      setIsFormOpen(false)
    } catch {
      toast.error("Couldn't send your message. Please try again!")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <PenLine className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Guestbook</h3>
            <p className="text-sm text-muted-foreground">Leave a note, say hello!</p>
          </div>
        </div>
        
        {!isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <PenLine className="h-[18px] w-[18px]" />
            Sign Guestbook
          </Button>
        )}
      </div>

      {/* Sign Form */}
      {isFormOpen && (
        <Card className="p-6 border-primary/20 bg-primary/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gb-name">Your Name</Label>
                <Input
                  id="gb-name"
                  placeholder="Ada Lovelace"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: (e.target as HTMLInputElement).value }))}
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label id="emoji-picker-label">Pick an Emoji</Label>
                <div className="flex gap-1 flex-wrap" role="group" aria-labelledby="emoji-picker-label">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                      className={`min-w-[44px] min-h-[44px] w-11 h-11 text-lg rounded-md transition-all flex items-center justify-center ${
                        formData.emoji === emoji
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      aria-label={`Select ${emoji} emoji`}
                      aria-pressed={formData.emoji === emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gb-message">Your Message</Label>
              <Textarea
                id="gb-message"
                placeholder="Great portfolio! Love the terminal section..."
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: (e.target as HTMLTextAreaElement).value }))}
                maxLength={280}
                rows={3}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.message.length}/280
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Send className="h-[18px] w-[18px]" />
                {isSubmitting ? "Sending..." : "Sign Guestbook"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Entries or Empty State */}
      {guestbookEntries.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {guestbookEntries.map((entry, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex gap-3">
                <span className="text-2xl">{entry.emoji || "👋"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold truncate">{entry.name}</span>
                    <span className="text-xs text-muted-foreground">{entry.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.message}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State - Inviting design */
        <Card className="p-8 text-center border-dashed border-2 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
          <div className="max-w-sm mx-auto space-y-4">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <PenLine className="h-10 w-10 text-primary" />
              </div>
              <Sparkles 
                className="absolute -top-1 -right-1 h-6 w-6 text-accent animate-pulse" 
              />
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Be the first to sign!</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                This guestbook is brand new and waiting for its first message. 
                Leave a note, share a thought, or just say hello. Your words will 
                be the start of something special.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 fill-red-400 text-red-400" />
              <span>Messages are reviewed with care before appearing</span>
            </div>

            {!isFormOpen && (
              <Button onClick={() => setIsFormOpen(true)} size="lg" className="gap-2 mt-2">
                <PenLine className="h-5 w-5" />
                Leave the First Message
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
