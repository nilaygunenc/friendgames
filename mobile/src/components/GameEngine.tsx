import React from 'react';
import { Game } from '../types';
import { VampirEngine } from './VampirEngine';
import { MafiaLiteEngine } from './MafiaLiteEngine';
import { AgentEngine } from './AgentEngine';
import { TabuEngine } from './TabuEngine';
import { QuestionEngine } from './QuestionEngine';
import { MysteryEngine } from './MysteryEngine';
import { EveryoneEngine } from './EveryoneEngine';
import { LegalCaseEngine } from './LegalCaseEngine';
import { FingersEngine } from './FingersEngine';
import { AuctionEngine } from './AuctionEngine';
import { MimeEngine } from './MimeEngine';

/** Add every new game engine here. GameDetail always routes through this component. */
export function GameEngine({ game }: { game: Game }) {
  switch (game.engine) {
    case 'vampir': return <VampirEngine />;
    case 'mafia-lite': return <MafiaLiteEngine />;
    case 'agent': return <AgentEngine />;
    case 'mime': return <MimeEngine />;
    case 'tabu': return <TabuEngine />;
    case 'buz-kirici': return <QuestionEngine gameId={game.id} />;
    case 'mystery': return <MysteryEngine />;
    case 'everyone': return <EveryoneEngine />;
    case 'legal': return <LegalCaseEngine />;
    case 'fingers': return <FingersEngine />;
    case 'auction': return <AuctionEngine />;
  }
}
