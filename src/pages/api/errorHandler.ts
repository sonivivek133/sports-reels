import { NextApiRequest, NextApiResponse } from 'next';

export function withErrorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}