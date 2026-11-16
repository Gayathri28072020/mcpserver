
const express = require('express');
const router = express.Router();

const { sql, connectDB } = require('../db');

// 1. CREATE TASK
router.post('/', async (req, res) => {
    try {
        const { Title, Description } = req.body;

        if (!Title) {
            return res.status(400).json({
                message: 'Title is required'
            });
        }

        const pool = await connectDB();

        const result = await pool.request()
            .input('Title', sql.NVarChar(200), Title)
            .input('Description', sql.NVarChar(sql.MAX), Description || null)
            .query(`
                INSERT INTO Tasks (Title, Description)
                OUTPUT INSERTED.*
                VALUES (@Title, @Description)
            `);

        res.status(201).json({
            message: 'Task created successfully',
            task: result.recordset[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 2. GET ALL TASKS
router.get('/', async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool.request().query(
            'SELECT * FROM Tasks ORDER BY Id DESC'
        );

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 3. GET TASK BY ID
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const pool = await connectDB();

        const result = await pool.request()
            .input('Id', sql.Int, id)
            .query('SELECT * FROM Tasks WHERE Id = @Id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 4. UPDATE TASK
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { Title, Description, IsCompleted } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        if (!Title || typeof IsCompleted !== 'boolean') {
            return res.status(400).json({
                message: 'Title and IsCompleted are required'
            });
        }

        const pool = await connectDB();

        const result = await pool.request()
            .input('Id', sql.Int, id)
            .input('Title', sql.NVarChar(200), Title)
            .input('Description', sql.NVarChar(sql.MAX), Description || null)
            .input('IsCompleted', sql.Bit, IsCompleted)
            .query(`
                UPDATE Tasks
                SET Title = @Title,
                    Description = @Description,
                    IsCompleted = @IsCompleted
                OUTPUT INSERTED.*
                WHERE Id = @Id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({
            message: 'Task updated successfully',
            task: result.recordset[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 5. DELETE TASK
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const pool = await connectDB();

        const result = await pool.request()
            .input('Id', sql.Int, id)
            .query(`
                DELETE FROM Tasks
                OUTPUT DELETED.*
                WHERE Id = @Id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({
            message: 'Task deleted successfully'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
