import { Languages, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { translateContent } from '../services/gemini'

export default function TranslationBar({ activeTab, onTranslated, getActiveContent }) {
  const [loading, setLoading] = useState(null)

  const handleTranslate = async (target) => {
    if (loading) return
    const content = getActiveContent()
    if (!content) { toast.error('No content on this tab to translate.'); return }
    setLoading(target)
    try {
      const translated = await translateContent(content, target)
      onTranslated(activeTab, translated)
      toast.success(target === 'roman-urdu' ? 'Translated to Roman Urdu' : 'Translated to Urdu script')
    } catch (e) {
      toast.error(e.message || 'Translation failed')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <Languages size={14} /> Translate:
      </span>
      <button onClick={() => handleTranslate('roman-urdu')} disabled={!!loading} className="btn-outline text-xs">
        {loading === 'roman-urdu' ? <Loader2 size={14} className="animate-spin" /> : null} Roman Urdu
      </button>
      <button onClick={() => handleTranslate('urdu-script')} disabled={!!loading} className="btn-outline text-xs">
        {loading === 'urdu-script' ? <Loader2 size={14} className="animate-spin" /> : null} Urdu Script
      </button>
    </div>
  )
}
