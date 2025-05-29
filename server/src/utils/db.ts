import { ClientSession, startSession } from "mongoose";

/**
 * Runs a given async function inside a Mongoose transaction.
 * Automatically commits on success and aborts on error.
 *
 * @template T - Return type of the transactional function
 * @param transactionalFn - An async function that receives a Mongoose session and returns a result
 * @returns The result of the transactional function
 */
export const withTransaction = async <T>(
  transactionalFn: (session: ClientSession) => Promise<T>
): Promise<T> => {
  const session = await startSession();
  session.startTransaction();

  try {
    const result = await transactionalFn(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
