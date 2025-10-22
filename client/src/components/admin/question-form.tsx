"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Option {
  id: number | string;
  text: string;
  score: number;
}

interface QuestionFormProps {
  question?: {
    _id?: string;
    text: string;
    options: Option[];
  };
  onSave: (question: any) => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onSave,
  onCancel,
}) => {
  // Initialize question text from prop (edit mode) or empty string (create mode)
  const [text, setText] = useState(question?.text || "");

  // Initialize options from prop (edit mode) or default options (create mode)
  const [options, setOptions] = useState<Option[]>(
    question?.options?.map((o) => {
      // Log if o.text is undefined for debugging
      if (o.text === undefined) {
        console.warn(`Option with id ${o.id} has undefined text`, o);
      }
      return {
        id: o.id || crypto.randomUUID(),
        text: o.text ?? "", // Fallback to empty string if text is undefined
        score: o.score ?? 0, // Fallback for score as well
      };
    }) || [
      { id: crypto.randomUUID(), text: "", score: 10 },
      { id: crypto.randomUUID(), text: "", score: 7 },
      { id: crypto.randomUUID(), text: "", score: 5 },
      { id: crypto.randomUUID(), text: "", score: 2 },
      { id: crypto.randomUUID(), text: "", score: 0 },
    ]
  );

  // Update a specific option's text or score
  const updateOption = (
    index: number,
    field: "text" | "score",
    value: string | number
  ) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  // Add a new empty option
  const addOption = () => {
    setOptions([...options, { id: crypto.randomUUID(), text: "", score: 0 }]);
  };

  // Remove an option if more than 2 exist
  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate: ensure question text and all option texts are non-empty
    if (!text.trim() || options.some((opt) => !opt.text.trim())) return;

    const isEditing = !!question?._id;
    const url = isEditing
      ? `http://localhost:3005/api/v1/quiz/${question._id}`
      : "http://localhost:3005/api/v1/quiz";

    const payload = {
      text: text.trim(),
      options: options.map((o) => ({ text: o.text.trim(), score: o.score })),
    };

    try {
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save question");

      const saved = await res.json();
      const responseData = saved.question || saved.data?.question || saved.data;

      // Normalize response to match local Question structure
      const normalized = {
        _id: responseData._id,
        text: responseData.text,
        options: (responseData.options || []).map((o: any) => ({
          id: o._id || crypto.randomUUID(),
          text: o.text ?? "", // Fallback to empty string
          score: o.score ?? 0,
        })),
      };

      onSave(normalized);

      // Reset form only in creation mode
      if (!isEditing) {
        setText("");
        setOptions([
          { id: crypto.randomUUID(), text: "", score: 10 },
          { id: crypto.randomUUID(), text: "", score: 7 },
          { id: crypto.randomUUID(), text: "", score: 5 },
          { id: crypto.randomUUID(), text: "", score: 2 },
          { id: crypto.randomUUID(), text: "", score: 0 },
        ]);
      }
    } catch (err) {
      console.error("Error saving question:", err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{question ? "Edit Question" : "Add New Question"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Question Text
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your question here..."
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Answer Options
            </label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={option.id} className="flex gap-2 items-center">
                  <Input
                    value={option.text}
                    onChange={(e) =>
                      updateOption(index, "text", e.target.value)
                    }
                    placeholder={question ? "" : `Option ${index + 1}`}
                    className="flex-1"
                    required
                  />
                  <Input
                    type="number"
                    value={option.score}
                    onChange={(e) =>
                      updateOption(
                        index,
                        "score",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="Score"
                    className="w-20"
                    min="0"
                    max="10"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {question ? "Update Question" : "Add Question"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export { QuestionForm };
