"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { Edit, Trash2, GripVertical } from "lucide-react";
import { Question } from "@/components/quiz/QuestionnaireContext";

interface DraggableQuestionProps {
  question: Question;
  index: number;
  onEdit: (question: Question) => void;
  onDelete: (id: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
}

const DraggableQuestion: React.FC<DraggableQuestionProps> = ({
  question,
  index,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <TableRow
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className="cursor-move hover:bg-gray-50"
    >
      <TableCell className="w-8">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{question.text}</p>
          <p className="text-sm text-gray-500">
            {question.options.length} answer options
          </p>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">Moral Choices</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="default">Active</Badge>
      </TableCell>
      <TableCell>
        <div>
          <p className="text-sm">Today</p>
          <p className="text-xs text-gray-500">by Admin</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(question)}>
            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(parseInt(question.id))}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export { DraggableQuestion };
