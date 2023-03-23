import { useContext } from 'react';
import SessionProvider, { SessionContext } from './provider';

const useSession = () => useContext(SessionContext);

export { useSession, SessionProvider };
