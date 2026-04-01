// src/components/admin/pages/Questions.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { QuestionForm } from "@/components/admin/question-form";
import { Question } from "@/components/quiz/QuestionnaireContext";
import { DraggableQuestion } from "@/components/admin/draggable-question";

const Questions = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:3005/api/v1/quiz");
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      const questions = (data?.data?.quiz || []).map((q: any) => ({
        id: q._id.toString(), // Convert ObjectId to string
        text: q.text,
        options: q.options.map((o: any) => ({
          id: o._id.toString(), // Convert option _id to string
          text: o.label, // Map label to text
          value: o.score, // Map score to value
        })),
      }));
      setQuestions(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter((q) =>
    q.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        console.log("Deleting question with ID:", id);
        const res = await fetch(`http://localhost:3005/api/v1/quiz/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const errorData = await res.json();
          console.error(
            "Delete failed with status:",
            res.status,
            "Response:",
            errorData
          );
          throw new Error(
            errorData.message || `Failed to delete question: ${res.status}`
          );
        }
        console.log("Question deleted successfully");
        await fetchQuestions();
      } catch (error: any) {
        console.error("Error deleting question:", error);
        setError(
          error.message || "Failed to delete question. Please try again."
        );
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const newQuestions = [...questions];
      const [moved] = newQuestions.splice(draggedIndex, 1);
      newQuestions.splice(dropIndex, 0, moved);
      setQuestions(newQuestions);
      try {
        await fetch("http://localhost:3005/api/v1/quiz/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions: newQuestions.map((q) => q.id) }),
        });
      } catch (error) {
        console.error("Error updating question order:", error);
        setError("Failed to update question order. Please try again.");
        await fetchQuestions();
      }
    }
    setDraggedIndex(null);
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        {error}
        <Button onClick={fetchQuestions} className="ml-4">
          Retry
        </Button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-8">
        <QuestionForm
          question={
            editingQuestion
              ? {
                  _id: editingQuestion.id,
                  text: editingQuestion.text,
                  options: editingQuestion.options.map((o) => ({
                    id: o.id,
                    text: o.text,
                    score: o.value,
                  })),
                }
              : undefined
          }
          onSave={async () => {
            await fetchQuestions();
            setShowForm(false);
            setEditingQuestion(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingQuestion(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quiz Questions</h1>
          <p className="text-gray-600 mt-2">
            Manage and organize your quiz content
          </p>
        </div>
        <Button
          className="bg-yellow-500 hover:bg-yellow-600 text-black w-fit"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Question
        </Button>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex gap-4 mb-4">
          <select className="px-3 py-2 border rounded-md">
            <option>All Categories</option>
            <option>Moral Choices</option>
            <option>Ethics</option>
          </select>
          <select className="px-3 py-2 border rounded-md">
            <option>All Status</option>
            <option>Active</option>
            <option>Draft</option>
          </select>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search questions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((question, index) => (
                <DraggableQuestion
                  key={question.id}
                  question={question}
                  index={index}
                  onEdit={handleEditQuestion}
                  onDelete={handleDeleteQuestion}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between p-6">
            <p className="text-sm text-gray-600">
              Showing 1-{filteredQuestions.length} of {questions.length}{" "}
              questions
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-purple-700 text-white"
              >
                1
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { Questions };
