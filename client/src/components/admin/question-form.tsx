"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { Question } from "@/components/quiz/QuestionnaireContext";
import { Textarea } from "@/components/ui/textarea";

interface QuestionFormProps {
  question?: Question;
  onSave: (question: Omit<Question, "id">) => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onSave,
  onCancel,
}) => {
  const [text, setText] = useState(question?.text || "");
  const [options, setOptions] = useState(
    question?.options || [
      { id: 1, text: "", value: 10 },
      { id: 2, text: "", value: 7 },
      { id: 3, text: "", value: 5 },
      { id: 4, text: "", value: 2 },
      { id: 5, text: "", value: 0 },
    ]
  );

  const updateOption = (
    index: number,
    field: "text" | "value",
    value: string | number
  ) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const addOption = () => {
    const newId = Math.max(...options.map((o) => o.id)) + 1;
    setOptions([...options, { id: newId, text: "", value: 0 }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && options.every((opt) => opt.text.trim())) {
      onSave({ text: text.trim(), options });
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
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                    required
                  />
                  <Input
                    type="number"
                    value={option.value}
                    onChange={(e) =>
                      updateOption(
                        index,
                        "value",
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
