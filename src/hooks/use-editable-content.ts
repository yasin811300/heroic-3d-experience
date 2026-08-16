import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useEditableContent = (pageName: string, sectionKey: string) => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from("editable_content")
          .select("content")
          .eq("page_name", pageName)
          .eq("section_key", sectionKey)
          .maybeSingle();

        if (error) throw error;
        if (data?.content) {
          try {
            setContent(JSON.parse(data.content));
          } catch {
            setContent(data.content);
          }
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [pageName, sectionKey]);

  return { content, loading, error };
};
