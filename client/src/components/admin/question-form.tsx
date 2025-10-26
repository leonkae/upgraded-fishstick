"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Option {
  id: number | string;
  text: string;
  score: number;
  _id?: string;
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
  useEffect(() => {
    console.log("QuestionForm: Incoming question prop:", question);
    if (question) {
      console.log("QuestionForm: Incoming question options:", question.options);
      setText(question.text || "");
      const mappedOptions =
        (question.options as any[])?.map((o) => {
          const option = {
            id: o.id || o._id || crypto.randomUUID(),
            text: o.text ?? "", // Rely on text, as it should be mapped from API's label
            score: o.score ?? 0,
          };
          console.log("QuestionForm: Mapped option:", option);
          return option;
        }) || [];
      setOptions(mappedOptions);
    } else {
      const defaultOptions = [
        { id: crypto.randomUUID(), text: "", score: 10 },
        { id: crypto.randomUUID(), text: "", score: 7 },
        { id: crypto.randomUUID(), text: "", score: 5 },
        { id: crypto.randomUUID(), text: "", score: 2 },
        { id: crypto.randomUUID(), text: "", score: 0 },
      ];
      console.log("QuestionForm: Default options:", defaultOptions);
      setText("");
      setOptions(defaultOptions);
    }
  }, [question]);

  const [text, setText] = useState(question?.text || "");
  const [options, setOptions] = useState<Option[]>(
    question?.options && question.options.length > 0
      ? question.options.map((o) => {
          const option = {
            id: o.id || crypto.randomUUID(),
            text: o.text ?? "", // Rely on text
            score: o.score ?? 0,
          };
          console.log("QuestionForm: Initial state mapped option:", option);
          return option;
        })
      : [
          { id: crypto.randomUUID(), text: "", score: 10 },
          { id: crypto.randomUUID(), text: "", score: 7 },
          { id: crypto.randomUUID(), text: "", score: 5 },
          { id: crypto.randomUUID(), text: "", score: 2 },
          { id: crypto.randomUUID(), text: "", score: 0 },
        ]
  );

  useEffect(() => {
    console.log("QuestionForm: Options state after setOptions:", options);
  }, [options]);

  const updateOption = (
    index: number,
    field: "text" | "score",
    value: string | number
  ) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const addOption = () => {
    const newOption = { id: crypto.randomUUID(), text: "", score: 0 };
    console.log("QuestionForm: Adding new option:", newOption);
    setOptions([...options, newOption]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      console.log(
        "QuestionForm: Removing option at index:",
        index,
        options[index]
      );
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || options.some((opt) => !opt.text.trim())) return;

    const isEditing = !!question?._id;
    const url = isEditing
      ? `http://localhost:3005/api/v1/quiz/${question._id}`
      : "http://localhost:3005/api/v1/quiz";

    const payload = {
      text: text.trim(),
      options: options.map((o) => ({ label: o.text.trim(), score: o.score })), // API expects label
    };
    console.log("QuestionForm: Submitting payload:", payload);

    try {
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save question");

      const saved = await res.json();
      const responseData = saved.question || saved.data?.question || saved.data;
      console.log("QuestionForm: API response:", responseData);

      const normalized = {
        _id: responseData._id,
        text: responseData.text,
        options: (responseData.options || []).map((o: any) => {
          const option = {
            id: o._id || crypto.randomUUID(),
            text: o.label ?? o.text ?? "", // Handle both label and text
            score: o.score ?? 0,
          };
          console.log("QuestionForm: Normalized response option:", option);
          return option;
        }),
      };

      onSave(normalized);

      if (!isEditing) {
        setText("");
        const defaultOptions = [
          { id: crypto.randomUUID(), text: "", score: 10 },
          { id: crypto.randomUUID(), text: "", score: 7 },
          { id: crypto.randomUUID(), text: "", score: 5 },
          { id: crypto.randomUUID(), text: "", score: 2 },
          { id: crypto.randomUUID(), text: "", score: 0 },
        ];
        console.log(
          "QuestionForm: Resetting to default options:",
          defaultOptions
        );
        setOptions(defaultOptions);
      }
    } catch (err) {
      console.error("QuestionForm: Error saving question:", err);
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
              {options.map((option, index) => {
                // Debug: Log option before rendering
                console.log("QuestionForm: Rendering option:", {
                  index,
                  option,
                });
                return (
                  <div key={option.id} className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={option.text}
                        onChange={(e) =>
                          updateOption(index, "text", e.target.value)
                        }
                        placeholder={`Enter option ${index + 1}`}
                        className="flex-1"
                        required
                      />
                    </div>
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
                );
              })}
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
