const {User} = require('../../model/user');
const hash = require('../../utils/hash');

module.exports = async (req, res) => {
    const {email, password} = req.body;
    if(email.trim().length === 0 || password.trim().length === 0) {
        res.status(400).render('admin/error', {
            msg: '用户名或密码不能为空'
        });
    }
    const user = await User.findOne({email});

    if(user) {
        // 证明邮箱存在
        // hash('ifer') === '22823e3b4f3376d3507865315ead9a3349c9369419084582e69f2130de813183'
        if(hash(password) === user.password) {
            // 才让登录
            req.session.username = user.username;
            // res.send('登录成功');
            res.redirect('/admin/user'); // 默认 302
        } else {
            res.status(400).render('admin/error', {
                msg: '密码错误'
            });
        }
    } else {
        // 证明邮箱根本不存在
        res.status(400).render('admin/error', {
            msg: '用户不存在'
        });
    }
};