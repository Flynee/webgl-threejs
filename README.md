# 纹理参数

| 常量名                    | 意思                                            | MIN  | MAG  |
| ------------------------- | ----------------------------------------------- | ---- | ---- |
| gl.NEAREST                | 最临近过滤，获得最靠近纹理坐标点的像素          | ○    | ○    |
| gl.LINEAR                 | 线性插值过滤，获取坐标点附近4个像素的加权平均值 | ○    | ○    |
| gl.NEAREST_MIPMAP_NEAREST | 选择最邻近的mip层，并使用最邻近过滤             | ○    | ×    |
| gl.NEAREST_MIPMAP_LINEAR  | 在mip层之间使用线性插值和最邻近过滤             | ○    | ×    |
| gl.LINEAR_MIPMAP_NEAREST  | 选择最邻近的mip层，使用线性过滤                 | ○    | ×    |
| gl.LINEAR_MIPMAP_LINEAR   | 在mip层之间使用线性插值和使用线性过滤           | ○    | ×    |

| 定数名             | 意味                       | 例                         |      |
| ------------------ | -------------------------- | -------------------------- | ---- |
| gl.REPEAT          | 范围外的值进行重复处理     | 1.25 = 0.25 : -0.25 = 0.75 |      |
| gl.MIRRORED_REPEAT | 范围外的值进行镜像重复处理 | 1.25 = 0.75 : -0.25 = 0.25 |      |
| gl.CLAMP_TO_EDGE   | 将值控制在0-1之间          | 1.25 = 1.00 : -0.25 = 0.00 |      |

# gl.stencilFunc
- glStencilFunc(GLenum func, GLint ref, GLuint mask)
    GL_ALWAYS：不和模板缓冲中的值进行对比，全部渲染出的像素值都进行正常绘制；
    GL_NEVER：不和模板缓冲中的值进行对比，全部渲染出的像素值都丢弃；
    GL_LESS、GL_LEQUAL、GL_GREATER、GL_GEQUAL、GL_EQUAL、GL_NOTEQUAL：按照规则对比模板缓冲中的值和渲染出来的值进行释放丢弃渲染结果的断定



# gl.stencilOp
- glStencilOp(GLenum sfail, GLenum dpfail, GLenum dppass)
    sfail：模板测试失败时采起的行为
    dpfail：模板测试经过，但深度测试失败时采起的行为
    dppass：模板测试和深度测试都经过时采起的行为

    KEEP（不改变，这也是默认值）
    ZERO（回零）
    REPLACE（使用测试条件中的设定值来代替当前模板值，stencilFunc方法中的ref参数）
    INCR（增长1，但若是已是最大值，则保持不变）
    INCR_WRAP（增长1，但若是已是最大值，则从零从新开始）
    DECR（减小1，但若是已是零，则保持不变）
    DECR_WRAP（减小1，但若是已是零，则从新设置为最大值）
    INVERT（按位取反）