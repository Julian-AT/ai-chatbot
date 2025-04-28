'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';
import { ArrowRightIcon } from 'lucide-react';

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'Complete Room Transformation',
      label:
        'Redesign an existing room. Change the color palette, move furniture etc.',
      action:
        'Redesign an existing room. Change the color palette, move furniture etc.',
    },
    {
      title: 'Improvement Suggestion',
      label: `Get solid suggestions for possible improvements for a room `,
      action: `Get solid suggestions for possible improvements for a room `,
    },
    {
      title: 'New Room Concept',
      label: `Generate a new room design concept entirely from scratch.`,
      action: `Generate a new room design concept entirely from scratch.`,
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-3 gap-2 w-full bg-[#F9F8FF] z-20"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 flex flex-col w-full h-full justify-start items-start bg-white"
          >
            <div className="flex flex-row justify-between items-center w-full">
              <span className="font-medium text-xl text-wrap">
                {suggestedAction.title}
              </span>
              <ArrowRightIcon className="size-4 ml-2" />
            </div>
            <div className="mt-2">
              <span className="text-muted-foreground text-wrap text-xs">
                {suggestedAction.label}
              </span>
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
