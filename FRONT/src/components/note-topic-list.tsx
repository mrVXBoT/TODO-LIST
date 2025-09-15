
"use client";

import * as React from "react";
import type { NoteTopic } from "@/lib/types";
import { NoteTopicItem } from "./note-topic-item";

interface NoteTopicListProps {
  noteTopics: NoteTopic[];
  onAddEntry: (noteTopic: NoteTopic) => void;
  onEditTopic: (noteTopic: NoteTopic) => void;
  onDeleteTopic: (id: string) => void;
}

const NoteTopicList: React.FC<NoteTopicListProps> = ({ noteTopics, onAddEntry, onEditTopic, onDeleteTopic }) => {
  return (
    <div className="space-y-4">
      {noteTopics.map((topic) => (
        <NoteTopicItem
          key={topic.id}
          noteTopic={topic}
          onAddEntry={() => onAddEntry(topic)}
          onEdit={() => onEditTopic(topic)}
          onDelete={() => onDeleteTopic(topic.id)}
        />
      ))}
    </div>
  );
};

export default NoteTopicList;

    