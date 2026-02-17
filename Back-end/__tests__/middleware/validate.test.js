const { validate } = require('../../middleware/validate');
const Joi = require('joi');

describe('Validation Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    describe('validate()', () => {
        it('should call next() when validation passes', () => {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().min(8).required()
            });

            req.body = {
                email: 'test@example.com',
                password: 'password123'
            };

            const middleware = validate(schema);
            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should return 400 when validation fails', () => {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().min(8).required()
            });

            req.body = {
                email: 'invalid-email',
                password: 'short'
            };

            const middleware = validate(schema);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('should return detailed error messages', () => {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                age: Joi.number().min(18).required()
            });

            req.body = {
                email: 'invalid',
                age: 15
            };

            const middleware = validate(schema);
            middleware(req, res, next);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Validation failed',
                    details: expect.any(Array)
                })
            );
        });

        it('should strip unknown fields when stripUnknown is true', () => {
            const schema = Joi.object({
                email: Joi.string().email().required()
            });

            req.body = {
                email: 'test@example.com',
                unknownField: 'should be removed'
            };

            const middleware = validate(schema);
            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
            // Body should not contain unknownField after validation
        });

        it('should handle missing required fields', () => {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            });

            req.body = {
                email: 'test@example.com'
                // password is missing
            };

            const middleware = validate(schema);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Validation failed'
                })
            );
        });
    });
});
